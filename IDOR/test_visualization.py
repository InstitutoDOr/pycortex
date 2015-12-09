
import cortex
import cortex.dataset as dts


subject = 'PRJ1210_SUBJ003'
my_min = 0.15
my_max = 0.4
cm='afmhot_inksel'
dv1 = cortex.Volume('/home/user/Desktop/pycortex/IDOR/train_00001.nii.gz', subject, 'fullhead', description='CORR1',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/user/Desktop/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
#dv1 = cortex.Volume('/home/user/Desktop/pycortex/IDOR/train_00001-mask.nii.gz', subject, 'fullhead', description='CORR1',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/user/Desktop/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
#dv1 = cortex.Volume('/home/user/Desktop/pycortex/IDOR/train_div10.nii.gz', subject, 'fullhead', description='CORR1',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="nearest", stim='/home/user/Desktop/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
dv2 = cortex.Volume('/home/user/Desktop/pycortex/IDOR/train_00002.nii.gz', subject, 'fullhead', description='CORR2',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/user/Desktop/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
#dv3 = cortex.Volume('/home/user/Desktop/pycortex/IDOR/train_00003.nii.gz', subject, 'fullhead', description='CORR3',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/user/Desktop/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
#cortex.webshow(dv1)

dat = dv1._data
import numpy as np
max_val = np.max(dat)

ds = dts.Dataset()
ds.append(T1=dv1)
ds.append(T2=dv2)
#ds.append(T3=dv3)

#cortex.webgl.make_static('EMOCODE',ds)

#cortex.webshow(ds)

import cortex.webgl.view_adapted
cortex.webgl.view_adapted.show_adapted(ds)




