const imageInput = document.getElementById("imageInput");

const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");

const preview = document.getElementById("preview");
const ctx = preview.getContext("2d");

const MAX_SIZE = 100;
const MAX_BLOCKS = 150000;

let loadedImage = null;

function clamp(value, min, max)
{
    return Math.max(min, Math.min(max, value));
}

function copy(text)
{
    navigator.clipboard.writeText(text)
        .then(() => {
            alert("Copied CM2 String!");
        })
        .catch(() => {
            alert("Failed to copy.");
        });
}

imageInput.addEventListener("change", e =>
{
    const file = e.target.files[0];

    if (!file)
        return;

    const reader = new FileReader();

    reader.onload = function(event)
    {
        loadedImage = new Image();

        loadedImage.onload = function()
        {
            preview.width =
                loadedImage.width;

            preview.height =
                loadedImage.height;

            ctx.drawImage(
                loadedImage,
                0,
                0
            );

            widthInput.value =
                Math.min(
                    loadedImage.width,
                    MAX_SIZE
                );

            heightInput.value =
                Math.min(
                    loadedImage.height,
                    MAX_SIZE
                );
        };

        loadedImage.src =
            event.target.result;
    };

    reader.readAsDataURL(file);
});

function generateImage()
{
    if (!loadedImage)
    {
        alert(
            "Upload an image first."
        );

        return;
    }

    let width =
        parseInt(widthInput.value);

    let height =
        parseInt(heightInput.value);

    width =
        clamp(
            width,
            1,
            MAX_SIZE
        );

    height =
        clamp(
            height,
            1,
            MAX_SIZE
        );

    preview.width =
        width;

    preview.height =
        height;

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    ctx.drawImage(
        loadedImage,
        0,
        0,
        width,
        height
    );

    const pixels =
        ctx.getImageData(
            0,
            0,
            width,
            height
        ).data;

    const result = [];

    for (let y = 0; y < height; y++)
    {
        for (let x = 0; x < width; x++)
        {
            const index =
                (y * width + x) * 4;

            const r =
                pixels[index];

            const g =
                pixels[index + 1];

            const b =
                pixels[index + 2];

            const a =
                pixels[index + 3];

            // ignore transparent pixels

            if (a < 10)
                continue;

            const cm2Y =
                -y;

            const cm2X =
                x;

            const cm2Z =
                0;

            result.push(
                `14,0,${cm2Y},${cm2X},${cm2Z},${r}+${g}+${b}+1+0`
            );
        }
    }

    if (result.length === 0)
    {
        alert(
            "Image contains no visible pixels."
        );

        return;
    }

    if (result.length > MAX_BLOCKS)
    {
        alert(
            `Image contains ${result.length.toLocaleString()} blocks.\n\nMaximum is ${MAX_BLOCKS.toLocaleString()}.`
        );

        return;
    }

    result[result.length - 1] += "???";

    copy(
        result.join(";")
    );
}
