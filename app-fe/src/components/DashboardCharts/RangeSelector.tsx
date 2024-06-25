const RangeSelector = () => {
    return (
        <div className="d-flex justify-content-end align-items-center gap-2">
            <span>Range</span>
            <div className="btn-group">
                <a
                    href="#"
                    className="btn btn-primary active"
                    aria-current="page"
                >
                    Day
                </a>
                <a href="#" className="btn btn-primary">
                    Week
                </a>
                <a href="#" className="btn btn-primary">
                    Month
                </a>
            </div>
        </div>
    );
};

export default RangeSelector;
