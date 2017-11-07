import glob
from PIL import Image
from PIL import ImageFont
from PIL import Image
from PIL import ImageDraw

fontsize = 70
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', fontsize)

fdir = '/media/sf_Dropbox/Doutorado/MusicalEncodingPaperDraft/PYCORTEX_FIGURES/pycortex_static_visualization/'
fdirout = fdir + 'cutouts/'

# (left hemisphere) left, top, right, bottom, (right hemisphere) left, top, right, bottom
pts = [[534,600,666,724,1450,604,1596,720],
[444,630,532,712,1420,664,1540,752],
[488,576,578,680,1396,594,1516,718],
[402,622,508,726,1406,642,1546,738],
[390,620,686,704,1546,608,1640,674],
[442,620,568,706,1416,630,1536,720]]

ss = ['S1','S2','S3','S4','S5','S7']
#fs = ['_PC1','_PC2']
fs = ['_PC3','_PC4']
lrn = ['_l' ,'_r']
#ss = ['S1']
#fs = [''] 

width = 500
height = 400

gap_lr = 50
gap_pc = 100
gap_ss = 50

total_width = 4*width + 5*gap_lr + gap_pc
total_height = 6*height+5*gap_ss+2*gap_lr

new_im = Image.new('RGB', (total_width, total_height))
draw = ImageDraw.Draw(new_im)

y_offset = gap_lr

for si,s in enumerate(ss):
    print(s)

    x_offset = gap_lr
    
    for f in fs:
        for lr in [0,1]:
            
            im = Image.open(fdirout + 'patch' + s + f + lrn[lr] + '.png')
            
            # overlay heschlgyrus outline
            hg = Image.open(fdirout + 'patch' + s + '_HG' + lrn[lr] + '.png')
            im.paste(hg, (0, 0), hg)
            
            # join images
            new_im.paste(im, (x_offset,y_offset))
            print x_offset
            x_offset += width + gap_lr
            
        # add subject identifier
        if f == '_PC1':
            draw.text((x_offset-gap_lr/2,y_offset+height/3), "S" + str(si+1), (255,255,255),font=font)
        x_offset += gap_pc

    y_offset += height + gap_ss
           
#draw = ImageDraw.Draw(new_im)
new_im.save(fdirout + 'joinedpatch_final_PC3PC4.png')

