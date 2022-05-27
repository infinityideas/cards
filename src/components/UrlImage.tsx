import { Image } from "react-konva";
import useImage from "use-image";
import { useState, useEffect } from "react";

const UrlImage = (props: any) => {
    const [image] = useImage(props.src);

    const [pos, setPos] = useState([props.x, props.y]);
    const [drag, setDrag] = useState(props.draggable);
    const [rot, setRot] = useState(props.rot);

    const cardDragEnd = (e: any) => {
        setPos([e.target.x(), e.target.y()]);
    }

    useEffect(() => {
        if (!((pos[0] == props.discardX) && (pos[1] == props.discardY))) {
            if (((pos[0] > props.discardX) && (pos[0] < props.discardX+120)) && ((pos[1] > props.discardY) && (pos[1] < props.discardY+174))) {
                setPos([props.discardX, props.discardY]);
                setDrag(false);
                setRot(0);
            } else {
                setPos([props.x, props.y]);
            }
        }
    }, [pos[0], pos[1]])
    
    return <Image 
        image={image} 
        x={pos[0]} 
        y={pos[1]} 
        width={props.width} 
        height={props.height} 
        draggable={drag} 
        rotation={rot}
        onDragEnd = {cardDragEnd}
        />
}

export default UrlImage;