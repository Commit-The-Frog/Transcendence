class RemoteGameException(Exception):
    pass

class AlreadyRegistered(RemoteGameException):
    pass

class GameAbnormalStopException(RemoteGameException):
    pass

class FullMatchException(RemoteGameException):
    pass

