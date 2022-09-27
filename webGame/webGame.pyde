from Target import *

"""
t1 = Target(200,200,50, 1, 15000, True)
t2 = Target(400,400,50, 1, 15000, True)
mid = Target(1000/2,600/2, 30, 1, None, False)
targets = [mid, t1,t2]"""

curDistance = 30
successes = 0
def diffGame():
    if sucesses < 5:
        pass
    else:
        curDistance += 20
        sucesses = 0

clickX = -1
clickY = -1
def mouseClicked():
    clickX = mouseX
    clickY = mouseY
    
    global targets 
    """
    for tar in targets: 
        if tar.clicked(clickX,clickY):
            tar.damage(1)
            if tar.isDead():
                print "killed"
                targets.pop(0)"""
                
    if targets[0].clicked(clickX,clickY):
        targets[0].damage(1)
        if targets[0].isDead():
            targets.pop(0)
        
    

targets = []
def handEyeGame():
    for a in range(0,360, 5):
        for r in range(40,400,20):
            for i in range(10):
                targets.append(Target(1000/2,600/2, 30, 1, None, False))
                targets.append(Target(1000/2 + cos(a) * r,600/2 + sin(a) * r, 30, 1, None, False))
                #targets.append(Target(1000/2,600/2, 30, 1, None, False))
                #print 1000/2 + cos(a) * r, 600/2 + sin(a) * r
            #return

def setup():
    size(1000,600)
    handEyeGame()
    
    
def draw():
    frameRate(2000)
    background(255)

    time = "{0:2d}:{1:2d}".format(millis()/60000, (millis()/1000) % 60)
    textSize(32)
    text(time, 900, 50)
    
    #print(targets[0].xpos)
    #print(targets[1].xpos)
    targets[0].tdraw()
