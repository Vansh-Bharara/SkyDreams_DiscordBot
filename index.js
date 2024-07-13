const {Client,GatewayIntentBits, Collection,REST,Routes, ReactionUserManager} = require("discord.js")
require("dotenv").config()
const weatherCmd = require("./commands/weatherCmd")

const client = new Client({
    intents:[GatewayIntentBits.GuildMembers,
            GatewayIntentBits.Guilds
        ]
})

const botInfo = {
    supportGuildId:"1261013314511831112",
    id:"1261578139235254303"
}

const rest = new REST().setToken(process.env.TOKEN)

client.commands = new Collection()
const commands = [weatherCmd.data.toJSON()]
client.commands.set(weatherCmd.data.name,weatherCmd)

client.on("interactionCreate",(interaction)=>{
    if(!interaction.isCommand()){
        return;
    }
    const {commandName} = interaction

    const cmd = client.commands.get(commandName)
    if(cmd){
        cmd.execute(interaction)
    }
    else{
        interaction.reply({content:"Invalid command"})
    }
})

const login = async ()=>{
    const data = await rest.put(Routes.applicationGuildCommands(botInfo.id,botInfo.supportGuildId),{
        body:commands
    })
    console.log(`Reloaded ${data.length} commands`)
    await client.login(process.env.TOKEN)
    console.log(`${client.user.tag} is now active`)
}
login()