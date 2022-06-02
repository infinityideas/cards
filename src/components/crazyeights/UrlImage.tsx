import { Image } from "react-konva";
import useImage from "use-image";
import { useState, useEffect, useRef } from "react";

export const isValid_CE = (current: any, discard: any) => {
    if (current.denomination == discard.denomination || current.suit == discard.suit || current.denomination == "Eight") {
        return true;
    }
    return false;
}

const UrlImage = (props: any) => {
    const [image] = useImage(props.src);

    const [pos, setPos] = useState([props.x, props.y]);
    const [drag, setDrag] = useState(props.draggable);
    const [rot, setRot] = useState(props.rot);
    const [zIndex, setZIndex] = useState();

    if (props.current) {
        console.log(props.x+" "+props.y+" "+props.current["toString"]);
    } else {
        console.log(props.x+" "+props.y);
    }
    

    const cardDragEnd = (e: any) => {
        setPos([e.target.x(), e.target.y()]);
        if (!(((pos[0] > props.discardX) && (pos[0] < props.discardX+120)) && ((pos[1] > props.discardY) && (pos[1] < props.discardY+174)))) {
            e.target.setZIndex(zIndex);
        }
    }

    const dragStart = (e: any) => {
        console.log("DRAG STARTED FOR "+props.current.toString);
        setZIndex(e.target.zIndex());
        e.target.moveToTop();
    }

    useEffect(() => {
        if (!((pos[0] == props.discardX) && (pos[1] == props.discardY))) {
            if (((pos[0] > props.discardX) && (pos[0] < props.discardX+120)) && ((pos[1] > props.discardY) && (pos[1] < props.discardY+174))) {
                if (isValid_CE(props.current, props.discard)) {
                    setPos([props.discardX, props.discardY]);
                    setDrag(false);
                    setRot(0);
                    setTimeout(props.dragEnd(props.current), 500);
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
        name = {props.current ? props.current["toString"] : ""}
        _useStrictMode
        ref= {props.target}
        onMouseUp = {props.clickAllowed ? props.onClick : null}
        />)
}

export default UrlImage;