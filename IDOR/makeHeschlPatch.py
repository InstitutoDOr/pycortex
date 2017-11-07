import glob
from PIL import Image

fdir = '/media/sf_Dropbox/Doutorado/MusicalEncodingPaperDraft/PYCORTEX_FIGURES/pycortex_static_visualization/'
fdirout = fdir + 'cutouts/'

# (left hemisphere) left, top, right, bottom, (right hemisphere) left, top, right, bottom
pts = [[534,600,666,724,1450,604,1596,720],
[444,630,532,712,1420,664,1540,752],
[488,576,578,680,1396,594,1516,718],
[402,622,508,726,1406,642,1546,738],
[390,620,500,704,1546,608,1640,674],
[442,620,568,706,1416,630,1536,720]]

ss = ['S1','S2','S3','S4','S5','S7']
##fs = ['','_HG','_PC1','_PC2']
fs = ['_PC3','_PC4']
lrn = ['_l' ,'_r']
#ss = ['S1']
#fs = [''] 

width = 500
height = 400

for si,s in enumerate(ss):
    print(s)
    
    for f in fs:
        filename = fdir + s + f + '.png'
        im = Image.open(filename)
        for lr in [0,1]:
            offset = lr*4
            # center cutout at midpoint of heschl outline in horizontal direction
            left = (pts[si][0+offset] + pts[si][2+offset])/2 - width/2 
            right = left + width 
            # center cutout at lower point of heschl outline in vertical direction
            upper = pts[si][3+offset] - height/2 
            lower = upper + height
            bbox = (left, upper, right, lower)
            
            print bbox
            cutout = im.crop(bbox)
            #cutout.show()
            cutout.save(fdirout + 'patch' + s + f + lrn[lr] + r'.png')

