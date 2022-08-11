import Div from "../Div";
import { Skeleton } from "@mui/material";
import { resizeImageUri } from "src/modules/uriUtils";
import { useState, useRef } from "react";
import Carousel from "re-carousel";
import IndicatorDots from "./indicator-dots";
import IndicatorButtons from "./indicator-buttons";
import ReactPlayer from 'react-player';

export function ProfileImage({width, height, uri, rounded=false, resize=false}) {
    const [loaded, setLoaded] = useState(false);
    return (
        rounded ? 
            <Div>
            {!loaded && <Skeleton variant="rectangular" width={width} height={height} />}
            <Div imgTag maxW={width} maxH={height} src={resize ?resizeImageUri(uri, width, height) : uri} rounded onLoad={()=>setLoaded(true)} style={loaded ? { display: 'block' } : { display: 'none' }}></Div>
            </Div>
            : 
             <Div>
            {!loaded && <Skeleton variant="rectangular" width={width} height={height} />}
            <Div imgTag maxW={width} maxH={height} src={resize ? resizeImageUri(uri, width, height) : uri} onLoad={()=>setLoaded(true)} style={loaded ? { display: 'block' } : { display: 'none' }}></Div>
            </Div>
    );
}

export function GetImage({maxHeight, maxWidth, uri, click=false}) {
    const [Load, setLoad] = useState(false)
    const img = new Image();
    img.src = uri;
    const width=img.width;
    const height=img.height;
    img.onload = () => {
        setLoad(true)
      };
      const handleClick = () => {
		window.open(img.src, '_blank')
	};
    return (
        !Load ? 
        <Skeleton variant="rectangular" width={maxWidth} height={maxHeight} animation="wave" sx={{ bgcolor: 'grey.200' }}/>
        :
        <Div>
        {width>height ? 
        <Div w={maxWidth} h={maxHeight} flex flexRow>
                {click ? 
                <Div selfCenter src={img.src} imgTag wFull cursorPointer onClick={handleClick}></Div>
                :
                <Div selfCenter src={img.src} imgTag wFull></Div>}
        </Div>
        :
        <Div w={maxWidth} h={maxHeight} flex flexCol>
                {click ? 
                <Div selfCenter src={img.src} imgTag hFull cursorPointer onClick={handleClick}></Div>
                :
                <Div selfCenter src={img.src} imgTag hFull></Div>
                }
        </Div>}
        </Div>
    )
}

export function GetVideo({maxHeight, maxWidth, uri}) {
    return (
        <Video uri={uri} maxHeight={maxHeight} maxWidth={maxWidth}/>
    )
}

const Video = ({uri, maxWidth, maxHeight}) => {
    return (
            <Div className='player-wrapper'>
                <ReactPlayer
                    className='react-player'
                    url={uri}
                    width={maxWidth}
                    height={maxHeight}
                    playing={true}
                    muted={true}
                    controls={true}
                    loop={true}
                />
            </Div>
    )
}


export function ImageSlide({uris, maxWidth, maxHeight, click=false}) {
    const carouselRef = useRef(null);
    return (
        uris.length>1 ?
        <Div h={maxHeight} w={maxWidth} bgBlack bgOpacity90>
        <Carousel auto ref={carouselRef} widgets={[IndicatorDots, IndicatorButtons]}>
        {uris.map((uri, index) => (
                uri.endsWith('.mp4') ? 
                <GetVideo maxHeight={maxHeight-30} maxWidth={maxWidth} uri={uri} key={index}/>
                :
				<GetImage maxHeight={maxHeight} maxWidth={maxWidth} uri={uri} click={click} key={index}/>
			)).filter((item) => item)}
        </Carousel>
        </Div>
        :
        <Div h={maxHeight} w={maxWidth}>
                {uris[0].endsWith('.mp4') ? 
                <GetVideo maxHeight={maxHeight} maxWidth={maxWidth} uri={uris[0]}/>
                :
				<GetImage maxHeight={maxHeight} maxWidth={maxWidth} uri={uris[0]} click={click}/>}
        </Div>
    );
}