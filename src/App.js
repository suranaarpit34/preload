import React, { Suspense, useState, useRef, useReducer } from "react";
const { unstable_useTransition: useTransition } = React;
import { useSuspenseQuery } from "micro-graphql-react";
import FlowItems from "./layout/FlowItems";
import Loading from "./ui/loading";
import { SuspenseImg } from "./SuspenseImage";

const GET_IMAGES_QUERY = `
query HomeModuleBooks(
  $page: Int
) {
  allBooks(
    SORT: { title: 1 },
    PAGE: $page,
    PAGE_SIZE: 20
  ) {
    Books{
      smallImage
    }
  }
}

`;

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <ShowImages />
    </Suspense>
  );
}

const INITIAL_TIME = +new Date();

function ShowImages() {
  const [page, setPage] = useState(1);
  const [cacheBuster, setCacheBuster] = useState(INITIAL_TIME);
  const [precacheImages, setPrecacheImages] = useState(true);

  const [startTransition, isPending] = useTransition({ timeoutMs: 10000 });

  const { data } = useSuspenseQuery(GET_IMAGES_QUERY, { page });
  const images = data.allBooks.Books.map(
    (b) => b.smallImage + `?cachebust=${cacheBuster}`
  );

  const onNext = () => {
    if (page < 20) {
      startTransition(() => {
        setPage((p) => p + 1);
      });
    } else {
      startTransition(() => {
        setCacheBuster(+new Date());
      });
    }
  };

  const togglePrecaching = (evt) => {
    setPrecacheImages((val) => evt.target.checked);
  };

  return (
    <div className="App">
      {isPending ? <Loading /> : null}
      <FlowItems>
        <button onClick={onNext} className="btn btn-xs btn-primary">
          Next images
        </button>
        <label style={{ display: "flex" }}>
          <span>Precache Images</span>
          <input
            defaultChecked={precacheImages}
            onChange={togglePrecaching}
            type="checkbox"
          />
        </label>
      </FlowItems>
      <FlowItems>
        {images.map((img) => (
          <div key={img}>
            {precacheImages ? (
              <SuspenseImg alt="" src={img} />
            ) : (
              <img alt="" src={img} />
            )}
          </div>
        ))}
      </FlowItems>
    </div>
  );
}
