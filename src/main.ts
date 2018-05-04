import * as Discord from "discord.js";
import * as winston from "winston";
import * as dotenv from "dotenv";
import * as fs from "fs";

const user = new Discord.Client();
const token = process.env.DISCORD_USER_TOKEN;
const server = process.env.DISCORD_SERVER_ID;
const gracePeriod = process.env.DISCORD_GRACE_PERIOD;

winston.configure({
	transports: [new winston.transports.Console({ level: "debug" })],
});
winston.cli();

winston.info("🎉  Starting Up");

user.on("ready", async () => {
	winston.debug("User Script Connected");
	winston.info("Getting User List");
	const guild = user.guilds.find("id", server);
	await guild.fetchMembers();
	const inactiveArray: Discord.GuildMember[] = [];

	for (const member of guild.members.array()) {
		if (await isInactive(member, guild)) {
			inactiveArray.push(member);
		}
	}

	winston.info("The following users are inactive:");

	inactiveArray.forEach((member) => {
		winston.info(`${member.toString()}`);
	});
});

async function isInactive(
	member: Discord.GuildMember,
	guild: Discord.Guild
): Promise<boolean> {
	const options: any = {
		author: member,
		limit: 1,
		sortBy: "timestamp",
		sortOrder: "desc",
	};
	const result = await guild.search(options);
	let lastMessage: Date;

	if (result.messages[0] == null) {
		winston.debug(`No messages for ${member.displayName}`);
		lastMessage = new Date(0);
	} else {
		lastMessage = result.messages[0].find((message) => {
			return message.hit === true;
		}).createdAt;
	}

	winston.debug(`Last message from ${member.displayName}: ${lastMessage}`);

	const joinDate = member.joinedAt;

	const sinceJoin = Date.now() - joinDate.getTime();
	const sinceLast = Date.now() - lastMessage.getTime();
	const inactivityLimit = sinceJoin / 2;

	if (sinceJoin > Number.parseInt(gracePeriod) && sinceLast > inactivityLimit) {
		winston.debug(`${member.displayName} is inactive`);
		return true;
	}
	if (sinceJoin < Number.parseInt(gracePeriod) && sinceLast > inactivityLimit) {
		winston.debug(
			`${member.displayName} is inactive but within the grace period`
		);
		return false;
	}
	return false;
}

user.login(token);
