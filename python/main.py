# super quickly developed terminal-based application for retrieving song-info

""" Imports """
# The api client to search the database
import discogs_client

# library to measure similarities in strings
import difflib

# User token, to be stored in a safer way soon
USER_TOKEN = "LDCLVKhiodWTTnuZyAIVCBSZkrhcaauGhobLlYbX"


def connect():
    """ Instantiates connection and returns discogs object """
    return discogs_client.Client('Song-Info-Finder', user_token=USER_TOKEN)


def main_loop():
    """ Runs the main loop of the programme """
    discogs = connect()
    query = input("please enter song info:")
    results = discogs.search(query)
    unpack_result(results, query)


def unpack_result(result, query):
    """ Runs the appropriate response depending on discogs response """
    if type(result).__name__ == "Release":
        parse_release(result)
    elif type(result).__name__ == "Artist":
        parse_artist(result)
    elif type(result).__name__ == "MixedPaginatedList":
        parse_mixed_paginated_list(result, query)
    else:
        print("other")


def parse_artist(result, query):
    """ Stub for function which will parse the artist object """
    return result is None or query is None


def parse_release(result, query):
    """ Parses a release object """
    print("======= Release ======")
    artist_name = ""
    for art in result.artists:
        artist_name += str(art.name) + "; "
    #s = '; '.join(str(art.name) for art in result.artists)
    print(artist_name)
    print(result.title)
    print(result.year)
    string = ""
    for gen in result.genres:
        string += gen + "; "
        print(string)
        print(result.country)
        index = contains_song(result.tracklist, query)
        print(index)
        print(result.labels)
        print("======================")
    return True


def parse_master(result, query):
    """ Parses main release in a list contained in a master release """
    return parse_release(result.main_release, query)


def parse_mixed_paginated_list(result, query):
    """ Parses database results returned as paginated list """
    if len(result) < 1:
        return
    for entry in result:
        flag = False
        if type(entry).__name__ == "Master":
            flag = parse_master(entry, query)
        elif type(entry).__name__ == "Release":
            flag = parse_release(entry, query)
        elif type(entry).__name__ == "Artist":
            flag = parse_artist(entry, query)
        if flag:
            break


def contains_song(tracklist, query):
    """ Iterates over tracklist and determines if song is contained """
    parsed_query = parse_query(query)
    if type(parsed_query).__name__ == "list":
        index1 = find(tracklist, parsed_query[0])
        index2 = find(tracklist, parsed_query[1])
        return max(index1, index2)
    return find(tracklist, parsed_query)


def parse_query(query):
    """ Parses a string query to determine whether a
    dash was present in the search query

    """
    if query.find("-") > 0:
        return query.split("-")
    return query


def find(tracklist, query):
    """ Searches a record entry to determine whether song
    is contained in release
    """
    for song in tracklist:
        if similar(song.title, query):
            return tracklist.index(song)
    return -1


def similar(str1, str2):
    """ Determines the index of similariy between two given
    strings using the XX algorithm
    """
    match = difflib.SequenceMatcher(
        a=str1.lower().strip(), b=str2.lower().strip())
    return match.ratio() > 0.9
