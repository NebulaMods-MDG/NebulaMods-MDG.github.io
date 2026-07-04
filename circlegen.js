const MAX_BLOCKS = 150000;

function copy(text)
{
    navigator.clipboard.writeText(text)
    .then(() =>
    {
        alert("Copied CM2 String!");
    })
    .catch(() =>
    {
        alert("Failed to copy.");
    });
}

function generateCircle()
{
    const radius =
        parseInt(
            document.getElementById(
                "radius"
            ).value
        );

    const block =
        parseInt(
            document.getElementById(
                "block"
            ).value
        );

    if (
        isNaN(radius) ||
        radius < 1
    )
    {
        alert(
            "Radius must be greater than 0."
        );

        return;
    }

    if (
        isNaN(block) ||
        block < 1 ||
        block > 19
    )
    {
        alert(
            "Block ID must be 1-19."
        );

        return;
    }

    const points =
        new Set();

    const result =
        [];

    for (
        let angle = 0;
        angle < 360;
        angle++
    )
    {
        const rad =
            angle *
            Math.PI /
            180;

        const y =
            Math.round(
                Math.cos(rad)
                * radius
            );

        const z =
            Math.round(
                Math.sin(rad)
                * radius
            );

        const key =
            `${y},${z}`;

        if (
            points.has(key)
        )
            continue;

        points.add(key);

        result.push(

`${block},0,${y},0,${z},`

        );

    }

    if (
        result.length === 0
    )
    {
        alert(
            "Nothing generated."
        );

        return;
    }

    if (
        result.length >
        MAX_BLOCKS
    )
    {
        alert(
            "Too many blocks."
        );

        return;
    }

    result[
        result.length - 1
    ] += "???";

    copy(
        result.join(";")
    );

}
