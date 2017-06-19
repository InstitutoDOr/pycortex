import glob
from PIL import Image
import PIL.ImageOps  

fdir = '/media/sf_D/Dropbox/Doutorado/MusicalEncodingPaperDraft/PYCORTEX_FIGURES/pycortex_static_visualization/'
fdirout = fdir + 'cutouts/'

ss = ['S1','S2','S3','S4','S5','S7']
fs = ['_HG']
lrn = ['_l' ,'_r']

width = 500
height = 400

for si,s in enumerate(ss):
    print(s)
    
    for f in fs:
        for lr in [0,1]:
            filename = fdirout + 'patch'+ s + f + lrn[lr] + '.png'
            fout = fdirout + 'patch' + s + f + lrn[lr] + '_w.png'
            image = Image.open(filename)
            if image.mode == 'RGBA':
                r,g,b,a = image.split()
                rgb_image = Image.merge('RGB', (r,g,b))

                inverted_image = PIL.ImageOps.invert(rgb_image)

                r2,g2,b2 = inverted_image.split()

                final_transparent_image = Image.merge('RGBA', (r2,g2,b2,a))

                final_transparent_image.save(fout)

            else:
                inverted_image = PIL.ImageOps.invert(image)
                inverted_image.save(fout)
        
