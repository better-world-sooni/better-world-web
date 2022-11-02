import Div from "../Div";
import { Skeleton } from "@mui/material";
import { resizeImageUri } from "src/modules/uriUtils";
import { useState, useRef } from "react";
import Carousel from "re-carousel";
import IndicatorDots from "./indicator-dots";
import IndicatorButtons from "./indicator-buttons";
import ReactPlayer from "react-player";
import { ArrowCircleUpIcon, PlusIcon, RefreshIcon, XIcon } from "@heroicons/react/outline";
import { Oval } from "react-loader-spinner";

export function ProfileImage({ width, height, nft, rounded = false, resize = false }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const source_uri = nft?.image_uri ? nft?.image_uri : nft?.nft_metadatum?.image_uri;
  const uri = resize ? resizeImageUri(source_uri, 400, 400) : source_uri;
  if (uri == null) {
    return <Div w={width} h={height} bgGray200 flex flexRow rounded={rounded} justifyCenter cursorPointer></Div>;
  }
  const img = new Image();
  img.src = uri;
  img.onload = () => setLoaded(true);
  img.onerror = () => setError(true);
  return !loaded ? (
    <Skeleton variant="rectangular" width={width} height={height} />
  ) : (
    <Div
      w={width}
      h={height}
      rounded={rounded}
      style={{
        backgroundImage: `url(${uri})`,
        backgroundSize: "cover",
        backgroundPositionX: "center",
        backgroundPositionY: "center",
      }}
    ></Div>
  );
}

export function SizedImage({ width, height, uri, onClick = null, reload = null, imageHasChanged = false, loading = false }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [hover, setHover] = useState(false);
  if (uri == null) {
    return (
      <>
        {imageHasChanged && (
          <Div absolute w={width} flex flexRow justifyEnd>
            <Div relative top={-15} left={15} w={30} h={30} flex flexRow justifyCenter rounded15 bgBlack cursorPointer onClick={reload}>
              <Div selfCenter>
                <RefreshIcon height={20} width={20} className="h-20 w-20 text-white" />
              </Div>
            </Div>
          </Div>
        )}
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
            {loading ? (
              <Oval height="50" width="50" color="black" secondaryColor="#FFFFFF" strokeWidth="10" />
            ) : (
              <ArrowCircleUpIcon height={50} width={50} className={"text-white"} />
            )}
          </Div>
        </Div>
      </>
    );
  }
  const img = new Image();
  img.src = uri;
  img.onload = () => setLoaded(true);
  img.onerror = () => setError(true);
  return (
    <Div>
      {!loaded ? (
        error ? (
          <>
            {imageHasChanged && (
              <Div absolute w={width} flex flexRow justifyEnd>
                <Div relative top={-15} left={15} w={30} h={30} flex flexRow justifyCenter rounded15 bgBlack cursorPointer onClick={reload}>
                  <Div selfCenter>
                    <RefreshIcon height={20} width={20} className="h-20 w-20 text-white" />
                  </Div>
                </Div>
              </Div>
            )}
            <Div
              w={width}
              h={height}
              bgGray200
              flex
              flexRow
              justifyCenter
              cursorPointer={onClick}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={onClick}
            >
              <Div selfCenter>
                {loading ? (
                  <Oval height="50" width="50" color="black" secondaryColor="#FFFFFF" strokeWidth="10" />
                ) : (
                  <ArrowCircleUpIcon height={50} width={50} className={"text-white"} />
                )}
              </Div>
            </Div>
          </>
        ) : (
          <Skeleton variant="rectangular" width={width} height={height} />
        )
      ) : (
        <>
          {imageHasChanged && (
            <Div absolute w={width} flex flexRow justifyEnd z50>
              <Div relative top={-15} left={15} w={30} h={30} rounded15 bgBlack flex flexRow justifyCenter cursorPointer onClick={reload}>
                <Div selfCenter>
                  <RefreshIcon height={20} width={20} className="h-20 w-20 text-white" />
                </Div>
              </Div>
            </Div>
          )}
          <Div
            w={width}
            h={height}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            flex
            flexRow
            justifyCenter
            cursorPointer={onClick}
            onClick={onClick}
            relative
            style={{
              backgroundImage: `url(${uri})`,
              backgroundSize: "cover",
              backgroundPositionX: "center",
              backgroundPositionY: "center",
            }}
          >
            {((hover && onClick) || loading) && (
              <>
                <Div absolute style={{ width: "100%", height: "100%" }} bgBlack bgOpacity40 />
                <Div selfCenter relative>
                  {loading ? (
                    <Oval height="50" width="50" color="black" secondaryColor="#FFFFFF" strokeWidth="10" />
                  ) : (
                    <ArrowCircleUpIcon height={50} width={50} className={"text-white"} />
                  )}
                </Div>
              </>
            )}
          </Div>
        </>
      )}
    </Div>
  );
}

export function UploadImage({ width, height, uri, onClick = null, onRemove = null, loading = false, enable = true }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [hover, setHover] = useState(false);
  const canClick = !loading && enable;
  if (uri == null) {
    return (
      <>
        <Div
          minW={width}
          minH={height}
          bgGray200
          flex
          flexRow
          justifyCenter
          cursorPointer={canClick}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={canClick && onClick}
        >
          <Div selfCenter>
            {loading ? (
              <Oval height="50" width="50" color="black" secondaryColor="#FFFFFF" strokeWidth="10" />
            ) : (
              <PlusIcon height={50} width={50} className={"text-white"} />
            )}
          </Div>
        </Div>
      </>
    );
  }
  const img = new Image();
  img.src = uri;
  img.onload = () => setLoaded(true);
  img.onerror = () => setError(true);
  return (
    <Div>
      {!loaded ? (
        error ? (
          <>
            {canClick && (
              <Div absolute w={width} flex flexRow justifyEnd>
                <Div
                  relative
                  top={-15}
                  left={15}
                  w={30}
                  h={30}
                  flex
                  flexRow
                  justifyCenter
                  rounded15
                  bgBlack
                  cursorPointer={canClick}
                  onClick={canClick && onRemove}
                >
                  <Div selfCenter>
                    <XIcon height={20} width={20} className="h-20 w-20 text-white" />
                  </Div>
                </Div>
              </Div>
            )}
            <Div
              w={width}
              h={height}
              bgGray200
              flex
              flexRow
              justifyCenter
              cursorPointer={canClick}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={canClick && onClick}
            >
              <Div selfCenter>
                {loading ? (
                  <Oval height="50" width="50" color="black" secondaryColor="#FFFFFF" strokeWidth="10" />
                ) : (
                  canClick && <PlusIcon height={50} width={50} className={"text-white"} />
                )}
              </Div>
            </Div>
          </>
        ) : (
          <Skeleton variant="rectangular" width={width} height={height} />
        )
      ) : (
        <>
          {canClick && (
            <Div absolute w={width} flex flexRow justifyEnd z50>
              <Div
                relative
                top={-15}
                left={15}
                w={30}
                h={30}
                rounded15
                bgBlack
                flex
                flexRow
                justifyCenter
                cursorPointer={canClick}
                onClick={canClick && onRemove}
              >
                <Div selfCenter>
                  <XIcon height={20} width={20} className="h-20 w-20 text-white" />
                </Div>
              </Div>
            </Div>
          )}
          <Div
            w={width}
            h={height}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            flex
            flexRow
            justifyCenter
            cursorPointer={canClick}
            onClick={canClick && onClick}
            relative
            style={{
              backgroundImage: `url(${uri})`,
              backgroundSize: "cover",
              backgroundPositionX: "center",
              backgroundPositionY: "center",
            }}
          >
            {((hover && onClick) || loading) && (
              <>
                {canClick && <Div absolute style={{ width: "100%", height: "100%" }} bgBlack bgOpacity40 />}
                <Div selfCenter relative>
                  {loading ? (
                    <Oval height="50" width="50" color="black" secondaryColor="#FFFFFF" strokeWidth="10" />
                  ) : (
                    canClick && <PlusIcon height={50} width={50} className={"text-white"} />
                  )}
                </Div>
              </>
            )}
          </Div>
        </>
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
        <Div w={maxWidth} flex flexRow>
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
