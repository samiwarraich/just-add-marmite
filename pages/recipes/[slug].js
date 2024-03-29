import { client } from "../../utils/client";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Skeleton from "../../components/Skeleton";

export const getStaticPaths = async () => {
  const res = await client.getEntries({
    content_type: "recipe",
  });

  const paths = res.items.map((item) => {
    return {
      params: { slug: item.fields.slug },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export async function getStaticProps({ params }) {
  const { items } = await client.getEntries({
    content_type: "recipe",
    "fields.slug": params.slug,
  });

  if (!items.length) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { recipe: items[0] },
    revalidate: 1,
  };
}

const RecipeDetails = ({ recipe }) => {
  if (!recipe) return <Skeleton />;

  const { featuredImage, title, cookingTime, ingredients, method } =
    recipe.fields;
  return (
    <div>
      <div className="banner">
        <Image
          src={"https:" + featuredImage.fields.file.url}
          width={1200}
          height={400}
        />
        <h2>{title}</h2>
      </div>
      <div className="info">
        <p>Take about {cookingTime} minutes to cook</p>
      </div>
      <div className="method">
        <div>{documentToReactComponents(method)}</div>
      </div>

      <style jsx>{`
        h2,
        h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
      `}</style>
    </div>
  );
};

export default RecipeDetails;
