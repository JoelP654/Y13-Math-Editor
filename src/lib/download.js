// Basic functionality to download html as an image

import { toPng, toBlob } from 'html-to-image';

export const downloadHtml = async (html, title, white) => {
    if (html) {
        // Get Image URL
        const dataUrl = await toPng(html,{ 
                backgroundColor: white ? "white" : null, // Set background to white or transparent
                cacheBust: true, // Forces cached values not to be used
                pixelRatio: 3 // Forces better resolution
            })
        // Create a link and click it to download
        const link = document.createElement("a")
        link.download = title
        link.href = dataUrl
        link.click()
    }
}

export const copyHtml = async (html) => {
    const blob = await toBlob(html,{ 
        backgroundColor: "white",
        cacheBust: true,
        pixelRatio: 3
    })
    await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
    ]);
}