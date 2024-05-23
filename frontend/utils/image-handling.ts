export default function imageHandling(e: Event) {
    const HTMLImage = e.target as HTMLImageElement;
    HTMLImage.src = "/logo.png";
}