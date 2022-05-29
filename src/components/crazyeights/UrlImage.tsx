import { Image } from "react-konva";
import useImage from "use-image";
import { useState, useEffect } from "react";

const UrlImage = (props: any) => {
    const [image] = useImage(props.src);

    const [pos, setPos] = useState([props.x, props.y]);
    const [drag, setDrag] = useState(props.draggable);
    const [rot, setRot] = useState(props.rot);
    const [zIndex, setZIndex] = useState();

    const cardDragEnd = (e: any) => {
        setPos([e.target.x(), e.target.y()]);
        if (!(((pos[0] > props.discardX) && (pos[0] < props.discardX+120)) && ((pos[1] > props.discardY) && (pos[1] < props.discardY+174)))) {
            e.target.setZIndex(zIndex);
        }
    }

    const dragStart = (e: any) => {
        setZIndex(e.target.zIndex());
        e.target.moveToTop();
    }

    useEffect(() => {
        if (!((pos[0] == props.discardX) && (pos[1] == props.discardY))) {
            if (((pos[0] > props.discardX) && (pos[0] < props.discardX+120)) && ((pos[1] > props.discardY) && (pos[1] < props.discardY+174))) {
                if (props.current.isValid_CE(props.discard)) {
                    setPos([props.discardX, props.discardY]);
                    setDrag(false);
                    setRot(0);
                } else {
                    setPos([props.x, props.y]);
                    
                }
            } else {
                setPos([props.x, props.y]);
            }
        }
    }, [pos[0], pos[1]])
    
    return (
    <Image 
        image={image} 
        x={pos[0]} 
        y={pos[1]} 
        width={props.width} 
        height={props.height} 
        draggable={drag} 
        rotation={rot}
        onDragEnd = {cardDragEnd}
        onDragStart = {dragStart}
        onMouseEnter = {(e: any) => {
            const container = e.target.getStage().container();
            container.style.cursor = props.cursor;
        }}
        onMouseLeave = {(e: any) => {
            const container = e.target.getStage().container();
            container.style.cursor = "default";
        }}
        name = {props.current ? props.current.toString() : ""}
        _useStrictMode
        />)
}

export default UrlImage;