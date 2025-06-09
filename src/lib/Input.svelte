<script lang="ts">
    import { handleForecast, handleAPI, input } from "./api/weather.svelte";

    let inputValue = "";
    $: inputValue = $input;
    $: input.set(inputValue);
    async function handleSubmit(event: Event) {
        event.preventDefault();
        await handleAPI();
        $input = "";
    }
</script>

<section class="flex place-content-center">
    <form
        class="flex gap-2 w-[40vw] place-content-center grow"
        onsubmit={handleSubmit}
    >
        <input
            class="bg-gray-200 w-fit rounded-sm text-black px-[.25rem] py-[.125rem] outline-blue-950 focus:outline-2 focus:outline-fuchsia-500"
            type="text"
            bind:value={inputValue}
            required
            placeholder="London"
        />
        <button
            class="bg-gray-200 hover:bg-gray-00 px-[0.5rem] py-[0.125rem] text-black rounded-sm focus:outline-2 focus:outline-offset-0 focus:outline-fuchsia-500"
            type="submit">Search</button
        >
    </form>
</section>
<!-- <div class="flex place-content-center m-[2rem]">
    <button
        class="bg-gray-200 hover:bg-gray-00 px-[0.5rem] py-[0.125rem] text-black rounded-sm focus:outline-2 focus:outline-offset-0 focus:outline-fuchsia-500"
        onclick={handleForecast}>Forecast</button
    >
</div> -->
