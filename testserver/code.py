
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def distance(self):
        return self.x ** self.x + self.y ** self.y


p = Point(2, 3)
print('Distance is', p.distance())
