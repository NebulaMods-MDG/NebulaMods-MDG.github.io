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
        isNaN(radius)
        || radius < 1
    )
    {
        alert(
            "Invalid radius."
        );

        return;
    }

    const blocks = [];
    const used = new Set();

    for (
        let a = 0;
        a < 360;
        a++
    )
    {
        const rad =
            a *
            Math.PI /
            180;

        const x =
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
            `${x},${z}`;

        if (
            used.has(key)
        )
            continue;

        used.add(key);

        blocks.push({
            x,
            z
        });
    }

    if (
        blocks.length >
        MAX_BLOCKS
    )
    {
        alert(
            "Too many blocks."
        );

        return;
    }

    let save = [];

    for (
        const b
        of blocks
    )
    {
        save.push(

`${block},0,${-b.x},0,${b.z},`

        );
    }

    let result =
        save.join(";");

    result += "?";

    const connections =
        [];

    for (
        let i = 1;
        i <= blocks.length;
        i++
    )
    {
        let next =
            i + 1;

        if (
            next >
            blocks.length
        )
        {
            next = 1;
        }

        connections.push(

`${i},${next}`

        );
    }

    result +=
        connections.join(";");

    result += "???";

    copy(result);
}
