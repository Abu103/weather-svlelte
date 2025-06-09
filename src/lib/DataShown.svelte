<script>
    import { weatherData, isLoading } from "./stores/weatherStore.svelte";
    import { countryAlpha2ToName } from "./stores/Country.svelte";
    import Spinner from "./Spinner.svelte";
    import { slide } from "svelte/transition";
    import { bounceIn, bounceInOut, elasticOut } from "svelte/easing";
</script>

<div class="min-h-[50vh] my-[2rem] flex items-center justify-center">
    <main
        class="w-[75%] h-[50vh] max-w-3xl md:max-sm:w-[100%] px-[1rem] bg-gray-700 rounded-lg shadow-md flex items-center justify-center text-xl leading-[2.25rem] tracking-[0.125rem]"
    >
        {#if $isLoading}
            <Spinner />
        {:else if $weatherData.icon && $weatherData.country}
            <div
                class="flex place-content-center flex-row-reverse justify-between max-h-full max-w-full gap-14 text-zinc-100 opacity-100"
                id="box"
                transition:slide={{ axis: "y", easing:elasticOut }}
            >
                <div class="flex flex-col object-cover place-content-center">
                    <img
                        class="place-self-center"
                        draggable="false"
                        src={`https://openweathermap.org/img/wn/${$weatherData.icon}@4x.png`}
                        alt={$weatherData.description}
                    />
                </div>
                <div class="flex flex-col text-white-200">
                    <p class="text-center break-words whitespace-normal">
                        {`Location: ${$weatherData.city}, ${countryAlpha2ToName[$weatherData.country]}`}
                    </p>
                    <p class="text-center">
                        Temperature:
                        {Math.round($weatherData.temperature)}&deg;C
                    </p>
                    <p class="text-center">
                        Feels Like: {$weatherData.temperatureFeelsLike}&deg;C
                    </p>
                    <p class="text-center">
                        Pressure: {$weatherData.pressure} hPa
                    </p>
                    <p class="text-center">
                        Humidity: {$weatherData.humidity}%
                    </p>
                    <p class="text-center">
                        Wind: {$weatherData.windSpeed} m/s
                    </p>
                </div>
            </div>
        {:else}
            <p>Enter any location</p>
        {/if}
    </main>
</div>
