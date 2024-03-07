package com.unblok

interface WordSuggestionsCallback {
//    var suggestionsList : List<String>
    fun onWordSuggestionsLoaded(suggestions: List<String>)
    fun onWordSuggestionsError(error: String)
}
