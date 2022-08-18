import { useEffect, useRef, useState } from "react";


const UseContainerDimensions = myRef => {
	const getDimensions = () => ({
	  width: myRef.current.offsetWidth,
	  height: myRef.current.offsetHeight
	})
  
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
	useEffect(() => {
	  const handleResize = () => {
		setDimensions(getDimensions())
	  }
  
	  if (myRef.current) {
		setDimensions(getDimensions())
	  }
  
	  window.addEventListener("resize", handleResize)
  
	  return () => {
		window.removeEventListener("resize", handleResize)
	  }
	}, [myRef])
  
	return dimensions;
  };

export const ContainerDimensions = () => {
    const ref = useRef()
	const { width, height } = UseContainerDimensions(ref)
    return ({ref, width, height})
}

  export default ContainerDimensions;