import React from "react";
import BG from '../assets/bg-img.png'

export const Home = () => {
    return (
        <div>
            <img className="bg-image" src={BG} alt="background-img" usemap="#image-map" />
            <div>
                <map name="image-map">
                    <area shape="poly" coords="239,354 276,361 307,373 328,383 330,415 279,419 236,410 197,396 198,367 215,358 399,-114 " href="#" alt="meme-button"/>
                </map>
            </div>
        </div>

    );
}