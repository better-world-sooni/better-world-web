import Div from "../Div";
import { Skeleton } from "@mui/material";
import { resizeImageUri } from "src/modules/uriUtils";
import { useState, useRef } from "react";
import Carousel from "re-carousel";
import IndicatorDots from "./indicator-dots";
import IndicatorButtons from "./indicator-buttons";
import ReactPlayer from "react-player";
import { ArrowCircleUpIcon } from "@heroicons/react/outline";

export function ProfileImage({ width, height, nft, rounded = false, resize = false }) {
  const [loaded, setLoaded] = useState(false);
  const uri = nft?.image_uri ? nft?.image_uri : nft?.nft_metadatum?.image_uri;
  return rounded ? (
    <Div>
      {!loaded && <Skeleton variant="rectangular" width={width} height={height} />}
      <Div
        imgTag
        maxW={width}
        maxH={height}
        src={resize ? resizeImageUri(uri, width, height) : uri}
        rounded
        onLoad={() => setLoaded(true)}
        style={loaded ? { display: "block" } : { display: "none" }}
      ></Div>
    </Div>
  ) : (
    <Div>
      {!loaded && <Skeleton variant="rectangular" width={width} height={height} />}
      <Div
        imgTag
        maxW={width}
        maxH={height}
        src={resize ? resizeImageUri(uri, width, height) : uri}
        onLoad={() => setLoaded(true)}
        style={loaded ? { display: "block" } : { display: "none" }}
      ></Div>
    </Div>
  );
}

export function SizedImage({ width, height, uri, onClick = null }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [hover, setHover] = useState(false);
  const img = new Image();
  img.src = uri;
  img.onload = () => setLoaded(true);
  img.onerror = () => setError(true);
  return (
    <Div>
      {!loaded ? (
        error ? (
          <Div
            w={width}
            h={height}
            bgGray200
            flex
            flexRow
            justifyCenter
            cursorPointer
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onClick}
          >
            <Div selfCenter>
              <ArrowCircleUpIcon height={50} width={50} className={hover ? "text-gray-600" : "text-gray-400"} />
            </Div>
          </Div>
        ) : (
          <Skeleton variant="rectangular" width={width} height={height} />
        )
      ) : (
        <Div
          w={width}
          h={height}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          flex
          flexRow
          justifyCenter
          cursorPointer
          relative
          onClick={onClick}
          style={{
            backgroundImage: `url(${uri})`,
            backgroundSize: "cover",
            backgroundPositionX: "center",
            backgroundPositionY: "center",
          }}
        >
          {hover && (
            <>
              <Div absolute style={{ width: "100%", height: "100%" }} bgBlack bgOpacity40 />
              <Div selfCenter relative>
                <ArrowCircleUpIcon height={50} width={50} className={"text-white"} />
              </Div>
            </>
          )}
        </Div>
      )}
    </Div>
  );
}

export function GetImage({ maxHeight, maxWidth, uri, click = false }) {
  const [Load, setLoad] = useState(false);
  const img = new Image();
  img.src = uri;
  const width = img.width;
  const height = img.height;
  img.onload = () => {
    setLoad(true);
  };
  const handleClick = () => {
    window.open(img.src, "_blank");
  };
  return !Load ? (
    <Skeleton variant="rectangular" width={maxWidth} height={maxHeight} animation="wave" sx={{ bgcolor: "grey.200" }} />
  ) : (
    <Div>
      {width > height ? (
        <Div w={maxWidth} h={maxHeight} flex flexRow>
          {click ? <Div selfCenter src={img.src} imgTag wFull cursorPointer onClick={handleClick}></Div> : <Div selfCenter src={img.src} imgTag wFull></Div>}
        </Div>
      ) : (
        <Div w={maxWidth} h={maxHeight} flex flexCol>
          {click ? <Div selfCenter src={img.src} imgTag hFull cursorPointer onClick={handleClick}></Div> : <Div selfCenter src={img.src} imgTag hFull></Div>}
        </Div>
      )}
    </Div>
  );
}

export function GetVideo({ maxHeight, maxWidth, uri }) {
  return <Video uri={uri} maxHeight={maxHeight} maxWidth={maxWidth} />;
}

const Video = ({ uri, maxWidth, maxHeight }) => {
  return (
    <Div className="player-wrapper">
      <ReactPlayer className="react-player" url={uri} width={maxWidth} height={maxHeight} playing={true} muted={true} controls={true} loop={true} />
    </Div>
  );
};

export function ImageSlide({ uris, maxWidth, maxHeight, click = false }) {
  const carouselRef = useRef(null);
  return uris.length > 1 ? (
    <Div h={maxHeight} w={maxWidth} bgBlack bgOpacity90>
      <Carousel auto ref={carouselRef} widgets={[IndicatorDots, IndicatorButtons]}>
        {uris
          .map((uri, index) =>
            uri.endsWith(".mp4") ? (
              <GetVideo maxHeight={maxHeight - 30} maxWidth={maxWidth} uri={uri} key={index} />
            ) : (
              <GetImage maxHeight={maxHeight} maxWidth={maxWidth} uri={uri} click={click} key={index} />
            )
          )
          .filter((item) => item)}
      </Carousel>
    </Div>
  ) : (
    <Div h={maxHeight} w={maxWidth}>
      {uris[0].endsWith(".mp4") ? (
        <GetVideo maxHeight={maxHeight} maxWidth={maxWidth} uri={uris[0]} />
      ) : (
        <GetImage maxHeight={maxHeight} maxWidth={maxWidth} uri={uris[0]} click={click} />
      )}
    </Div>
  );
}
