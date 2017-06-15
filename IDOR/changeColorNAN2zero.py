import glob
from PIL import Image

for filename in glob.iglob('*/**/*.png'):
    print(filename)
    
    im = Image.open(filename)
    pixelMap = im.load()

    for i in range(im.size[0]):
        for j in range(im.size[1]):
            if pixelMap[i,j]==(0,0,192,255):
                pixelMap[i,j] = (0,0,0,0)      
    im.save(filename) 
    im.close()

