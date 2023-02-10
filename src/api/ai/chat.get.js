const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async ctx => {
    if (!configuration.apiKey) return ctx.fail = "OpenAI API key not configured, please follow instructions in README.md";

    const prompt = ctx.reqQuery.str || '';

    if (prompt.trim().length === 0) return ctx.fail = "Please enter a valid animal";
    try {
        const completion = await openai.createImage({
            prompt,
            n: 4,
            size: "1024x1024",
          });
        return ctx.success = completion.data
    } catch (e) {
        if (e.response) {
            // return ctx.fail = e.response.status;
            return ctx.fail = e.response.data;
        } else {
            return ctx.fail = e.message;
        }
    }
}

function generatePrompt(animal) {
    const capitalizedAnimal =
      animal[0].toUpperCase() + animal.slice(1).toLowerCase();
    return `Suggest three names for an animal that is a superhero.
  
  Animal: Cat
  Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
  Animal: Dog
  Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
  Animal: ${capitalizedAnimal}
  Names:`;
  }