// Joel Patterson
// 23/5/26
// Downloader
// Contains basic functionality to download or copy html as an image

import { toPng, toBlob } from 'html-to-image';

// This function downloads the given html as an image
// Also allows for control over if background color is white or not
export const downloadHtml = async (html, title, white) => {
    if (html) {
        const dataUrl = await toPng(html,{ 
                backgroundColor: white ? "white" : null,
                cacheBust: true, // Ensures the image is refreshed
                pixelRatio: 3
            })
        // Create a link and click it to download
        const link = document.createElement("a")
        link.download = title
        link.href = dataUrl
        link.click()
    }
}

// Copies the given html as an image to the clipboard
export const copyHtml = async (html) => {
    const blob = await toBlob(html,{ 
        backgroundColor: "white",
        cacheBust: true, // Ensures the image is refreshed
        pixelRatio: 3
    })
    await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
    ]);
}