import sys
sys.path.insert(0, '/home/brain/pycortex')
import cortex
import cortex.dataset as dts

subjects = ['S1','S2','S3','S6']
orig = [1,2,3,7]	
my_min = -0.1
my_max = 0.1
cm='afmhot_inksel'

ds = dts.Dataset()

for idx, s in enumerate(subjects):
	subject = 'PRJ1210_SUBJ00' + str(orig[idx])
	iidx = format(idx+1, '04d')
	dv01 = cortex.Volume('/home/brain/pycortex/IDOR/images/RESULTS/S' + str(orig[idx]) + 'W_mean_PC1best300voxels_Applied2All.nii.gz', subject, 'fullhead', description='', vmin=my_min, vmax=my_max, cmap='RdBu_r')
	kwargs = {s: dv01}

	ds.append(**kwargs)


import cortex.webgl.view_adapted
cortex.webgl.view_adapted.make_static('PC1_300vx_html' , ds)



