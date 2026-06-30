const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const ctx = preview.getContext("2d");

const MAX_SIZE = 100;
const MAX_BLOCKS = 150000;

let loadedImage = null;

function copy(text)
{
    navigator.clipboard.writeText(text)
        .then(() => alert("Copied CM2 String!"))
        .catch(() => alert("Failed to copy."));
}

imageInput.addEventListener("change", e =>
{
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event)
    {
        loadedImage = new Image();

        loadedImage.onload = function()
        {
            let width = loadedImage.width;
            let height = loadedImage.height;

            // scale down proportionally
            const scale = Math.min(MAX_SIZE / width, MAX_SIZE / height);

            width = Math.max(1, Math.round(width * scale));
            height = Math.max(1, Math.round(height * scale));

            preview.width = width;
            preview.height = height;

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(loadedImage, 0, 0, width, height);
        };

        loadedImage.src = event.target.result;
    };

    reader.readAsDataURL(file);
});

function generateImage()
{
    if (!loadedImage)
    {
        alert("Upload an image first.");
        return;
    }

    const width = preview.width;
    const height = preview.height;

    const pixels = ctx.getImageData(0, 0, width, height).data;

    const result = [];

    for (let y = 0; y < height; y++)
    {
        for (let x = 0; x < width; x++)
        {
            const index = (y * width + x) * 4;

            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];
            const a = pixels[index + 3];

            if (a < 10) continue;

            /*
                ✅ TRUE CM2 MAPPING (based on your working generator)

                Image:
                    x = horizontal
                    y = vertical

                CM2:
                    X = -y (inverted vertical)
                    Y = x (horizontal becomes height axis)
                    Z = 0 (flat plane)
            */

            const cm2X = -y;
            const cm2Y = x;
            const cm2Z = 0;

            result.push(
                `14,0,${cm2Y},${cm2X},${cm2Z},${r}+${g}+${b}+1+0`
            );
        }
    }

    if (result.length === 0)
    {
        alert("Image contains no visible pixels.");
        return;
    }

    if (result.length > MAX_BLOCKS)
    {
        alert(
            `Image contains ${result.length.toLocaleString()} blocks.\n` +
            `Maximum is ${MAX_BLOCKS.toLocaleString()}.`
        );
        return;
    }

    // CM2 save marker
    result[result.length - 1] += "???";

    copy(result.join(";"));
}
