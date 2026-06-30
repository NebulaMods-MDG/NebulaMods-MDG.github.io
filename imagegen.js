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

            // scale down if needed
            if (width > MAX_SIZE)
            {
                const scale = MAX_SIZE / width;
                width = MAX_SIZE;
                height = Math.round(height * scale);
            }

            if (height > MAX_SIZE)
            {
                const scale = MAX_SIZE / height;
                height = MAX_SIZE;
                width = Math.round(width * scale);
            }

            preview.width = width;
            preview.height = height;

            ctx.clearRect(0, 0, width, height);

            ctx.drawImage(
                loadedImage,
                0,
                0,
                width,
                height
            );
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

    let width = loadedImage.width;
    let height = loadedImage.height;

    // resize again for safety
    if (width > MAX_SIZE)
    {
        const scale = MAX_SIZE / width;
        width = MAX_SIZE;
        height = Math.round(height * scale);
    }

    if (height > MAX_SIZE)
    {
        const scale = MAX_SIZE / height;
        height = MAX_SIZE;
        width = Math.round(width * scale);
    }

    preview.width = width;
    preview.height = height;

    ctx.clearRect(0, 0, width, height);

    ctx.drawImage(loadedImage, 0, 0, width, height);

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

            const cm2X = x;
const cm2Y = 1;
const cm2Z = -y;

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

    // keep your CM2 format ending marker
    result[result.length - 1] += "???";

    copy(result.join(";"));
}
