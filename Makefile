ZANIMO = zanimo
BUILDDIR = dist
VERSION = `cat VERSION`
FILES = src/Zanimo.js

all: build www

build: cat
	@@java -jar bin/compiler.jar --js ${BUILDDIR}/${ZANIMO}-${VERSION}.js --js_output_file ${BUILDDIR}/${ZANIMO}-${VERSION}.min.js

cat:
	@@cat ${FILES} > ${BUILDDIR}/${ZANIMO}-${VERSION}.js;

test:
	@@phantomjs test/launch.js

www:
	@@stylus www/css/style.styl

clean:
	@@rm ${BUILDDIR}/${ZANIMO}-${VERSION}.min.js
	@@rm ${BUILDDIR}/${ZANIMO}-${VERSION}.js

.PHONY: test www
