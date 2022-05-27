import { Image } from "react-konva";
import useImage from "use-image";

const UrlImage = (props: any) => {
    const [image] = useImage(props.src);
    return <Image image={image} x={props.x} y={props.y} width={props.width} height={props.height} draggable={props.draggable} rotation={props.rot}/>
}

export default UrlImage;