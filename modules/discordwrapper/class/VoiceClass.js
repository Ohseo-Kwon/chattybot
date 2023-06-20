const voice = require('@discordjs/voice');

class VoiceClass {
    constructor(guildId) {
        this._guildId = guildId;
        this._tts = undefined;
    }

    // get channel id
    get channel() {
        // get bot's current voice connection on guild
        const connection = voice.getVoiceConnection(this.guildId);
        return connection.joinConfig.channelId;
    }
    
    // get-set TTS class
    get TTS()  { return this._tts; }
    set TTS(value)  { this._tts = value; }

    // join into specified voice channel
    async join(channel) {
        // create voice connection and wait for it
        const connection = await voice.joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
        await voice.entersState(connection, voice.VoiceConnectionStatus.Ready, 5_000);

        // set speaking status to none
        connection.setSpeaking(0);

        return true;
    }

    // play voice stream to voice channel
    play(stream) {
        // get bot's current voice connection on guild
        const connection = voice.getVoiceConnection(this.guildId);

        //TODO: check if bot joined voice channel first
        if (!connection) return false;

        const player = voice.createAudioPlayer({ behaviors: { noSubscriber: voice.NoSubscriberBehavior.Stop }});
        const resource = voice.createAudioResource(stream, { inputType: voice.StreamType.OggOpus });

        connection.subscribe(player);
        player.play(resource);

        return voice.entersState(player, voice.AudioPlayerStatus.Playing, 5_000);
    }

    // leave from currently joined voice channel
    async leave() {
        // get bot's current voice connection on guild
        const connection = voice.getVoiceConnection(this.guildId);

        //TODO: check if bot joined voice channel first
        if (!connection) return false;

        connection.destroy();
        return true;
    }
}

module.exports = VoiceClass;
