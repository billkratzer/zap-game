const HIGH_SCORE_KEY = "zap-high-scores"

class HighScores {

    constructor() {

        this.scores = []

        this.storage = window.localStorage

        let serialized = this.storage.getItem(HIGH_SCORE_KEY)
        if (serialized) {
            this.scores = this.deserialize(serialized)
        }
        else {
            this.scores = this.buildEmptyScoreTable()
        }
    }

    isHighScore(points) {
        for (var i = 0; i < this.scores.length; i++) {
            if (points > this.scores[i].points) {
                return true
            }
        }
        return false
    }

    // returns 1 - 10 (scores.length)
    getHighScoreRank(points) {
        for (var i = 0; i < this.scores.length; i++) {
            if (points > this.scores[i].points) {
                return i + 1
            }
        }
        return -1
    }

    addHighScore(points, name) {
        let rank = this.getHighScoreRank(points)
        if ( rank == - 1 ) {
            return
        }
        let index = rank - 1

        let score = {
            points: points,
            name: name
        }
        this.scores.splice(index, 0, score)
        this.scores.pop()

        let serialized = this.serialize(this.scores)
        this.storage.setItem(HIGH_SCORE_KEY, serialized)
    }

    buildEmptyScoreTable() {

        let scores = []

        for (let i = 0; i < 10; i++) {
            let score = {
                points: 0,
                name: "Nobody"
            }
            scores.push(score)
        }

        return scores;
    }

    serialize(scores) {
        let serialized = ""

        for (let i = 0; i < scores.length; i++) {
            let score = scores[i]
            serialized = serialized + score.name + ":" + score.points
            if (i < scores.length - 1) {
                serialized = serialized + ","
            }
        }

        return serialized
    }

    deserialize(s) {
        let entries = s.split(",")

        let scores = []

        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i]
            let parts = entry.split(":")
            let score = {
                name: parts[0],
                points: parseInt(parts[1])
            }
            scores.push(score)
        }

        return scores
    }

}