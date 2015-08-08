"""
This module will contain the logic required for
the searchin algorithms and query parsing functionality.

The idea is that for a given query, we will be able
to determine a 'radius of similarity', which will allow
us to find song infomration despite search queries
not being correct.
"""


def similar():
    """ This method will determine the distance between two strings """
    return True


def distance(str1, str2):
    """ Will return the distance between the two strings """
    test_strings1 = str1.split(" ")
    test_strings2 = str2.split(" ")
    return True


def reduce_spaces(str1):
    """ Eliminates redundant spaces in the given string """
    if len(str1) <= 1:
        return str1
    if str1[0] == ' ':
        if str1[1] == ' ':
            return reduce_spaces(str1[1:])
        else:
            return " " + reduce_spaces(str1[1:])
    return str1[0] + reduce_spaces(str1[1:])
