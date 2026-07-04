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
        parseFloat(
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

    const density =
        parseInt(
            document.getElementById(
                "density"
            ).value
        );

    if(isNaN(radius))
        return;

    const result = [];

    const count =
        Math.max(
            8,
            density
        );

    for(
        let i = 0;
        i < count;
        i++
    )
    {
        const angle =
            i /
            count *
            Math.PI *
            2;

        const x =
            Math.cos(angle)
            *
            radius;

        const z =
            Math.sin(angle)
            *
            radius;

        result.push(

`${block},0,${x.toFixed(3)},0,${z.toFixed(3)},`

        );
    }

    result[result.length-1] +=
        "???";

    navigator.clipboard.writeText(

        result.join(";")

    );

    alert(

`Copied ${count} blocks`

    );
}
