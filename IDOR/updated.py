
import cortex

my_min = 0
my_max = 1
#subject = 'fsaverage'
subject = 'S1'

path1 = 'ToM.nii'
dv1 = cortex.Volume(path1, subject, 'icbmtrans', cmap="RdBu_r", vmin=my_min, vmax=my_max, dfilter="trilinear")
cortex.webgl.make_static('LTPJ_TOM', dv1)
