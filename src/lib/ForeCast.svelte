<script lang="ts">
    import { forecast } from "./stores/weatherStore.svelte";
    import { handleForecast } from "./api/weather.svelte";
    import { slide } from "svelte/transition";

    document.addEventListener("DOMContentLoaded", () => {
        const dialog = document.getElementById(
            "Dialog",
        ) as HTMLDialogElement | null;
        const showButton = document.getElementById("showDialog");
        const closeButton = document.getElementById("closeDialog");
        const pageContent = document.getElementById("pageContent");

        // "Show the dialog" button opens the dialog modally
        if (showButton && dialog && closeButton && pageContent) {
            showButton.addEventListener("click", async () => {
                await handleForecast();
                dialog.showModal();
                dialog.scroll(0, -1000);
            });
            closeButton.addEventListener("click", () => {
                dialog.close();
                pageContent.classList.remove("blurred");
            });
            dialog.addEventListener("close", () => {
                pageContent.classList.remove("blurred");
            });
        }
    });

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    }

    function getWeatherColor(icon: string): string {
        if (icon.includes("01")) return "bg-yellow-400";
        if (icon.includes("02") || icon.includes("03")) return "bg-gray-400";
        if (icon.includes("09") || icon.includes("10")) return "bg-blue-400";
        if (icon.includes("11")) return "bg-indigo-500";
        return "bg-zinc-800";
    }
</script>

<div class="flex place-content-center m-[2rem]">
    <div id="pageContent" class="transition duration-300">
        <button
            id="showDialog"
            class="bg-gray-200 hover:bg-gray-100 px-[0.5rem] py-[0.125rem] text-black rounded-sm focus:outline-2 focus:outline-offset-0 focus:outline-fuchsia-500"
            >Forecast</button
        >
    </div>

    <dialog id="Dialog">
        <div class="flex overflow-x-auto gap-6 px-4 py-6" transition:slide>
            {#each $forecast as day, i (i)}
                <div
                    class={`min-w-[200px] rounded-lg shadow-md flex-shrink-0 p-4 text-white ${getWeatherColor(day.icon)}`}
                >
                    <div class="text-center font-semibold text-lg">
                        {formatDate(day.date)}
                    </div>
                    <div class="flex justify-center my-2">
                        <img
                            src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                            alt={day.description}
                            class="w-16 h-16"
                        />
                    </div>
                    <div class="text-center">{day.description}</div>
                    <div class="text-sm text-center mt-2">
                        <p>Temp: {Math.round(day.temperature)}°C</p>
                        <p>Wind: {day.windSpeed} m/s</p>
                    </div>
                </div>
            {/each}
        </div>

        <button
            class="bg-gray-200 hover:bg-gray-100 px-[0.5rem] py-[0.125rem] my-[1rem] text-black rounded-sm focus:outline-2 focus:outline-offset-0 focus:outline-fuchsia-500"
            id="closeDialog">close</button
        >
    </dialog>
</div>

<style>
    :modal {
        place-self: center;
        backdrop-filter: blur(5px);
        background-color: #444444;
        text-align: center;
        text-justify: newspaper;
        border-radius: 0.25rem;
        box-shadow: 0px 0px 1px white;
    }
    #closeDialog {
        outline-offset: 0;
    }

    .blurred {
        filter: blur(16px);
        pointer-events: none;
        user-select: none;
    }
</style>
