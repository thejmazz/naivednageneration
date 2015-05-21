import sys
import random

nts = int(sys.argv[1])
seq = ""

# A *very* naive random DNA generation algorithm
# But can you do better?
for nt in range(nts):
    r = random.random()
    if (r > 0.75):
        seq += "A"
    elif (r > 0.5):
        seq += "T"
    elif (r > 0.25):
        seq += "C"
    else:
        seq += "G"

print(seq, end="")
