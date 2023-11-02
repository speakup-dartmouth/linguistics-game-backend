import Suggestion from '../models/suggestion_model'

export async function createSuggestion(suggestionFields) {
    // await creating a suggestion
    const suggestion = new Suggestion();
    suggestion.prompt = suggestionFields.prompt;
    suggestion.stances = suggestionFields.stances;
    suggestion.dateSubmitted = suggestionFields.dateSubmitted;
    suggestion.icon = suggestionFields.icon;
    suggestion.question = suggestionFields.question;
    suggestion.status = suggestionFields.status;
    suggestion.user = suggestionFields.user;

    // return suggestion
    try {
        const savedSuggestion = await suggestion.save();
        return savedSuggestion;
    } catch (error) {
        throw new Error(`create suggestion error ${error}`)
    }
}

export async function getSuggestions() {
    try {
        const suggestions = await Suggestion.find();
        return suggestions;
    } catch (error) {
        throw new Error(`get suggestions error ${error}`);
    }
}

export async function getUserSuggestions(id) {
    try {
        const suggestions = await Suggestion.find({ user: id });
        // suggestions.sort(function(a, b) {
        //     return b.dateSubmitted - a.dateSubmitted
        // });
        return suggestions;
    } catch (error) {
        throw new Error(`get user suggestions error ${error}`);
    }
}

export async function getSuggestion(id) {
    try {
        const suggestion = await Suggestion.findById(id);
        return suggestion;
    } catch (error) {
        throw new Error(`get suggestions error ${error}`);
    }
}

export async function deleteSuggestion(id) {
    try {
        await Suggestion.findByIdAndDelete(id);
        return { msg: `suggestion ${id} found and deleted successfully` };
    } catch (error) {
        throw new Error(`delete suggestion error ${error}`);
    }
}