const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const ctx = preview.getContext("2d");

const MAX_SIZE = 100;
const MAX_BLOCKS = 150000;

let loadedImage = null;

/*
    ===== CM2 TRANSFORM SETTINGS =====
    If orientation is wrong, ONLY change these 2 values.
*/

const FLIP_X = true;
const FLIP_Y = true;   // fixes most upside-down issues
const SWAP_AXES = true; // only true if image is rotated 90°
const HEIGHT_OFFSET = 1;

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
            let w = loadedImage.width;
            let h = loadedImage.height;

            const scale = Math.min(MAX_SIZE / w, MAX_SIZE / h);

            w = Math.round(w * scale);
            h = Math.round(h * scale);

            preview.width = w;
            preview.height = h;

            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(loadedImage, 0, 0, w, h);
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

    let w = preview.width;
    let h = preview.height;

    const pixels = ctx.getImageData(0, 0, w, h).data;

    const result = [];

    for (let y = 0; y < h; y++)
    {
        for (let x = 0; x < w; x++)
        {
            const i = (y * w + x) * 4;

            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];

            if (a < 10) continue;

            // ===== BASE COORDS =====
            let cx = x;
            let cz = y;

            // Flip controls (fixes mirroring)
            if (FLIP_X) cx = (w - 1) - cx;
            if (FLIP_Y) cz = (h - 1) - cz;

            // Axis swap (fix 90° rotation cases)
            if (SWAP_AXES)
            {
                const t = cx;
                cx = cz;
                cz = t;
            }

            const cy = HEIGHT_OFFSET;

            result.push(
                `14,0,${cy},${cx},${cz},${r}+${g}+${b}+1+0`
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

    result[result.length - 1] += "???";

    copy(result.join(";"));
}
