const MAX_BLOCKS = 150000;

function copy(text)
{
    navigator.clipboard.writeText(text)
        .then(() =>
        {
            alert("Copied CM2 String!");
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

    const thickness =
        parseInt(
            document.getElementById(
                "thickness"
            ).value
        );

    const block =
        parseInt(
            document.getElementById(
                "block"
            ).value
        );

    if(isNaN(radius))
        return;

    const points = [];

    const used =
        new Set();

    for(
        let x = -radius;
        x <= radius;
        x++
    )
    {
        for(
            let z = -radius;
            z <= radius;
            z++
        )
        {
            const d =
                Math.sqrt(
                    x*x +
                    z*z
                );

            if(
                d <= radius &&
                d >= radius-thickness
            )
            {
                const key =
                    `${x},${z}`;

                if(
                    used.has(key)
                )
                    continue;

                used.add(key);

                points.push({

                    x,
                    z,

                    angle:

                    Math.atan2(
                        z,
                        x
                    )

                });
            }
        }
    }

    points.sort(

        (a,b)=>

        a.angle-b.angle

    );

    if(
        points.length >
        MAX_BLOCKS
    )
    {
        alert(
            "Too many blocks."
        );

        return;
    }

    let save=[];

    for(
        const p
        of points
    )
    {
        save.push(

`${block},0,${-p.x},0,${p.z},`

        );
    }

    let result =
        save.join(";");

    result += "?";

    let connections=[];

    for(
        let i=1;
        i<=points.length;
        i++
    )
    {
        let next =
            i+1;

        if(
            next >
            points.length
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
