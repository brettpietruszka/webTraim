class Target:
    
    def __init__(self, x,y,r, hp, lifespan, ds):
        self.xpos = x
        self.ypos = y
        self.radius = r
        self.curRadius = r
        self.active = True
        self.deathTimer = -1
        self.startTime = None
        self.hp = hp
        self.lifespan = lifespan
        self.dynamic_size = ds
        
    def isDead(self):
        return self.hp <= 0
                
    def clicked(self, x,y): 
        distance = sqrt((x-self.xpos)**2 + (y-self.ypos)**2)
        print distance, self.curRadius
        return distance < self.curRadius
    
    def damage(self, hp):
        if self.hp is None:
            return
        self.hp -= hp
        if self.hp <= 0:
            self.deathTimer = millis()
            
        
            
        
    def tdraw(self):
        if not self.hp is None and self.hp <= 0:
            if self.active:
                if millis() - self.deathTimer < 200 and self.deathTimer != -1:
                    fill(0)
                    circle(self.xpos, self.ypos, self.curRadius)
                    return
                else:
                    self.active = False
                    return
            else: 
                return
        
        fill(255,0,0)
        noStroke()

        if self.startTime is None:
            self.startTime = millis()
        
            
        
        elapsedTime = millis() - self.startTime
        if self.lifespan is None:
            self.curRadius = self.radius
            circle(self.xpos, self.ypos, self.radius)
        elif elapsedTime < self.lifespan:
            if self.dynamic_size:
                self.curRadius = self.radius * (elapsedTime/float(self.lifespan))
                circle(self.xpos, self.ypos, self.curRadius)
            else:
                self.curRadius = self.radius
                circle(self.xpos, self.ypos, self.radius)
        
        
