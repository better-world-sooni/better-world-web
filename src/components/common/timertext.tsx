import { useState, useEffect } from 'react'
import DefaultTransition from './defaulttransition';


export default function TimerText({condtion, text, seconds, closecontidion=null}) {
	const [show, setshow] = useState(false);
	useEffect(() => {
		var timer
		if (condtion) {
			setshow(true)
			timer = setTimeout(() => {
				setshow(false);
				if (closecontidion!=null){closecontidion()}
			}, seconds*1000);
		} else {
			setshow(false)
		}
		return () => {clearTimeout(timer)};
	}, [condtion]);
	return (
		<DefaultTransition show={show} content={text}/>
		);
}

