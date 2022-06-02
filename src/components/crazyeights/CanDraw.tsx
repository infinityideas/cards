import { isValid_CE } from "./UrlImage";

export function CanDraw(hand: Array<any>, discardCard: any) {
    for (var x=0; x<hand.length; x++) {
        if (isValid_CE(hand[x], discardCard)) {
            return false;
        }
    }
    return true;
}