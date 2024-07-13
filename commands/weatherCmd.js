const {SlashCommandBuilder, EmbedBuilder} =  require("discord.js")
const axios = require("axios")
require("dotenv").config()



const weatherCmd = {
    data:
        new SlashCommandBuilder()
            .setName("weather")
            .setDescription("Get weather of a city")
            .addStringOption((op)=>op.setName("cityname")
                                     .setDescription("City Name")
                                     .setRequired(true)
        ),
        execute : async (interaction)=>{
            const cityName = interaction.options.getString("cityname")
            const {data} = await axios.get("https://api.openweathermap.org/data/2.5/weather",{
                params:{
                    q:cityName,
                    appid:process.env.weatherTOKEN,
                    units:"metric"
                }
            })

            const embedmsg = new EmbedBuilder().setTitle(`Weather in ${data.name},${data.sys.country}`)
                                               .addFields({
                                                name:"Temperature",
                                                value:`${data.main.temp} °C`
                                               },
                                            {
                                                name : "feels like",
                                                value:`current : ${data.main.feels_like}°C`
                                            },
                                            {
                                                name:"Weather",
                                                value:data.weather[0].main
                                            },
                                            {
                                                name:"Max and Min temperature",
                                                value:`Max : ${data.main.temp_max}°C\nMin: : ${data.main.temp_min}°C`
                                            },
                                            {
                                                name:"Wind speed and Humidity",
                                                value:`Wind Speed: ${data.wind.speed.toString()}\nHumidity: ${data.main.humidity}`
                                            })
                                            .setThumbnail(`http://openweathermap.org/img/w/${data.weather[0].icon}.png`)

            console.log(data)
            interaction.reply({
                embeds:[embedmsg]  
            })

        }
        
}

module.exports = weatherCmd