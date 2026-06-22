const cron = require("node-cron");

const {
    decayInterests,
} = require(
    "../services/interestDecayService"
);

const startInterestDecayJob =
    () => {

        cron.schedule(
            "0 3 * * *",
            async () => {

                console.log(
                    "Running interest decay..."
                );

                await decayInterests();
            }
        );

        console.log(
            "Interest Decay Job Started"
        );
    };

module.exports = {
    startInterestDecayJob,
};