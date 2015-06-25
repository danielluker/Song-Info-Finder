# super quickly developed terminal-based application for retrieving song-info

""" Imports """
# The api client to search the database
import discogs_client

# library to measure similarities in strings
import difflib

""" User token, to be stored in a safer way soon """
userToken = "LDCLVKhiodWTTnuZyAIVCBSZkrhcaauGhobLlYbX"


def connect():
    return discogs_client.Client('Song-Info-Finder', user_token=userToken)

def main_loop():
    d = connect()
    query = raw_input("please enter song info:")
    results = d.search(query)
    unpack_result(results, query)

def unpack_result(result, query):
    if type(result).__name__ == "Release":
        parseRelease(result)
    elif type(result).__name__ == "Artist":
        parseArtist(result)
    elif type(result).__name__ == "MixedPaginatedList":
        parseMixedPaginatedList(result, query)
    else:
        print ("other")

def parseArtist(result, query):
    return False

def parseRelease(result, query):
    print ("======= Release ======")
    s = ""
    for art in result.artists:
        s += str(art.name) + "; "
    print (s)
    print (result.title)
    print (result.year)
    s = ""
    for gen in result.genres:
        s +=  gen + "; "
    print (s)
    print (result.country)
    index = containsSong(result.tracklist, query)
    print (index)
    print (result.labels)
    print ("======================")
    return True

def parseMaster(result, query):
    return parseRelease(result.main_release, query)

def parseMixedPaginatedList(result, query):
    if len(result) < 1:
        return;
    for entry in result:
        print(type(entry).__name__)
        flag = False
        if type(entry).__name__ == "Master":
            flag = parseMaster(entry, query)
        elif type(entry).__name__ == "Release":
            flag = parseRelease(entry, query)
        elif type(entry).__name__ == "Artist":
            flag = parseArtist(entry, query)
        if flag:
            break;

def containsSong(tracklist, query):
    s = parseQuery(query)
    if type(s).__name__ == "list":
        return max(find(tracklist, s[0]), find(tracklist, s[1]))
    return find(tracklist, s)
    
def parseQuery(query):
    if(query.find("-") > 0):
        return query.split("-")
    return query

def find(tracklist, query):
    for song in tracklist:
        if similar(song.title, query):
            return tracklist.index(song)
    return -1

def similar(str1, str2):  
    return difflib.SequenceMatcher(a=str1.lower(), b=str2.lower()).ratio() > 0.9

main_loop()
